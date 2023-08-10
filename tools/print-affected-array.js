const path = require('path');

const spawn = require('cross-spawn');

const processArguments = process.argv.slice(2);

const ALL_FLAG = '--all';
const TASK_NAME = processArguments[0];
const BASE_BRANCH_NAME = processArguments[1];
const ROOT_PATH = path.resolve(__dirname, '..');
const ENCODING_TYPE = 'utf8';
const NEW_LINE_CHAR = '\n';

class CliLogs {
  constructor() {
    this._logs = [];
    this.log = this.log.bind(this);
  }

  log(log) {
    const cleanLog = log.trim();
    if (cleanLog.length) {
      this._logs.push(cleanLog);
    }
  }

  get logs() {
    return this._logs;
  }

  get joinedLogs() {
    return this.logs.join(NEW_LINE_CHAR);
  }
}

function pnpmRun(...args) {
  const logData = new CliLogs();
  let pnpmProcess;
  return new Promise((resolve, reject) => {
    const processOptions = {
      cwd: ROOT_PATH,
      env: process.env
    };

    pnpmProcess = spawn('pnpm', args, processOptions);

    pnpmProcess.stdin.setEncoding(ENCODING_TYPE);
    pnpmProcess.stdout.setEncoding(ENCODING_TYPE);
    pnpmProcess.stderr.setEncoding(ENCODING_TYPE);
    pnpmProcess.stdout.on('data', logData.log);
    pnpmProcess.stderr.on('data', logData.log);

    pnpmProcess.on('close', (code) => {
      if (code !== 0) {
        reject(logData.joinedLogs);
      } else {
        resolve(logData.joinedLogs);
      }
    });
  });
}

function commaSeparatedListToArray(str) {
  return str
    .trim()
    .split(',')
    .map((element) => element.trim())
    .filter((element) => !!element.length);
}

function getAffectedCommandResult(str) {
  const outputLines = str.trim().split(/\r?\n/);
  if (outputLines.length > 0) {
    return outputLines.filter((line) => line.length > 0);
  }
  return '';
}

async function affectedProjectsContainingTask(taskName, baseBranch) {
  // pnpm nx show projects --withTarget [task] --affected --base [base branch]
  return getAffectedCommandResult(
    await pnpmRun(
      'nx',
      'show',
      'projects',
      '--withTarget',
      taskName,
      '--affected',
      '--base',
      baseBranch
    )
  );
}

async function allProjectsContainingTask(taskName) {
  // pnpm nx show projects --withTarget [task]
  return getAffectedCommandResult(
    await pnpmRun('nx', 'show', 'projects', '--withTarget', taskName)
  );
}

async function printAffectedProjectsContainingTask() {
  const projects =
    BASE_BRANCH_NAME === ALL_FLAG
      ? await allProjectsContainingTask(TASK_NAME)
      : await affectedProjectsContainingTask(TASK_NAME, BASE_BRANCH_NAME);
  console.log(JSON.stringify(projects));
}

printAffectedProjectsContainingTask().catch((error) => {
  console.error(error);
  process.exit(1);
});
