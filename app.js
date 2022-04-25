const form = document.querySelector("form");
const tbody = document.querySelector("tbody");
const burstTime = document.getElementById("burst-time");
const processType = document.getElementById("process-type");
const arrivalTime = document.getElementById("arrival-time");

// global variables
let processId = 0;
let time = 0;
processManager = ProcessManager(new RoundRobin(), new FCFS());

// queues
const systemQueue = [];
const interactiveQueue = [];

class Process {
  constructor(id, type, burstTime, arrivalTime) {
    this.id = id;
    this.type = type;
    this.burstTime = burstTime;
    this.arrivalTime = arrivalTime;
    this.isCompleted = false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // add process
  processManager.addProcess(
    new Process(
      processId++,
      processType.value === "Proceso de Sistema" ? "system" : "interactive",
      burstTime.value,
      arrivalTime.value
    )
  );

  // clear inputs
  burstTime.value = "";
});

// planning algorithms

class PlanningAlgorithm {
  constructor() {
    this.queue = [];
  }

  addProcess(process) {
    this.queue.push(process);
  }

  getProcess() {
    return this.queue.shift();
  }

  returnUnfinishedProcess(process) {
    this.queue.push(process);
  }

  hasProcesses() {
    return this.queue.length > 0;
  }
}

class FCFS extends PlanningAlgorithm {
  returnUnfinishedProcess(process) {
    this.queue.unshift(process);
  }
}

class RoundRobin extends PlanningAlgorithm {}

class ProcessManager {
  constructor(systemProcess, interactiveProcess) {
    this.allProcesses = [];
    this.systemProcess = systemProcess;
    this.interactiveProcess = interactiveProcess;
  }

  run() {
    let time = 0;
    let completed = 0;
    let quantum = 5;
    let currentProcess = null;

    while (completed < this.allProcesses.length) {
      // insert just arrived processes
      this.addJustArrivedProcesses(time);

      // get process to work on
      if (!currentProcess) {
        currentProcess = this.getWorkingProcess();
      }
    }
  }

  addProcess(process) {
    this.allProcesses.push(process);
  }

  addJustArrivedProcesses(currentTime) {
    this.allProcesses
      .filter((process) => process.arrivalTime === currentTime)
      .forEach((process) => {
        if (process.type === "system") {
          this.systemProcess.addProcess(process);
        } else {
          this.interactiveProcess.addProcess(process);
        }
      });
  }

  getWorkingProcess() {
    if (this.systemProcess.hasProcesses()) {
      return this.systemProcess.getProcess();
    } else {
      return this.interactiveProcess.getProcess();
    }
  }
}

const runtimeSelector = () => {
  const totalProcesses = systemQueue.length + interactiveQueue.length;
  let completed = 0;

  while (completed < totalProcesses) {
    // add processes that have just arrived
    justArrivedProcesses(time);

    // get process to work with
    const process = getProcess();
  }
};
