const form = document.querySelector("form");
const tbody = document.querySelector("tbody");
const burstTime = document.getElementById("burst-time");
const processType = document.getElementById("process-type");
const arrivalTime = document.getElementById("arrival-time");
const animateBtn = document.getElementById("animate-btn");

// global variables
let processId = 0;

class Process {
  constructor(id, type, burstTime, arrivalTime) {
    this.id = id;
    this.type = type;
    this.burstTime = burstTime;
    this.totalTime = 0;
    this.arrivalTime = arrivalTime;
    this.endTime = -1;
    this.isCompleted = false;
  }

  work(time) {
    this.totalTime += 1;
    if (this.totalTime === this.burstTime) {
      this.isCompleted = true;
      this.endTime = time + 1;
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (burstTime.value === "") return;

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
    this.completedProcesses = [];
    this.systemProcess = systemProcess;
    this.interactiveProcess = interactiveProcess;
  }

  run() {
    let time = 0;
    let completed = 0;
    let quantum = 5;
    let currentQuantum = 0;
    let currentProcess = null;
    let rrProcess = false;
    const data = [];

    while (completed < this.allProcesses.length) {
      // insert just arrived processes
      this.addJustArrivedProcesses(time);

      // get process to work on
      if (!currentProcess) {
        currentProcess = this.getWorkingProcess();
        // if there is no process, continue
        if (!currentProcess) {
          time++;
          continue;
        }
        // check if it has a Round Robin algorithm
        rrProcess = currentProcess.type === "system";
      }

      // work on process
      currentProcess.work(time);

      // timestamps
      data.push(
        this.allProcesses.map((process) =>
          process.id === currentProcess.id ? [time, time + 1] : null
        )
      );

      // check it it has finished
      if (currentProcess.isCompleted) {
        this.completedProcesses.push(currentProcess);
        completed++;
        currentProcess = null;
      } else {
        if (currentProcess.type === "interactive") {
          this.interactiveProcess.returnUnfinishedProcess(currentProcess);
          currentProcess = null;
        } else {
          // check quantum
          if (++currentQuantum >= quantum) {
            this.systemProcess.returnUnfinishedProcess(currentProcess);
            currentProcess = null;
            currentQuantum = 0;
          }
        }
      }

      // increment time
      time++;
    }
    console.log("Finihsed");
    return data;
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
    } else if (this.interactiveProcess.hasProcesses()) {
      return this.interactiveProcess.getProcess();
    }
    return null;
  }
}

function DataSet(data) {
  this.label = ``;
  this.data = data;
  this.backgroundColor = processList.map(
    (process) => `hsl(${process.hue}, 50%, 70%)`
  );
  this.borderColor = processList.map(
    (process) => `hsl(${process.hue}, 80%, 30%)`
  );
  this.borderWidth = 3;
  this.borderSkipped = false;
  this.borderRadius = 15;
}

const processList = [
  new Process(1, "interactive", 10, 0),
  new Process(2, "system", 10, 0),
];

const processManager = new ProcessManager(new RoundRobin(), new FCFS());

processList.forEach((process) => processManager.addProcess(process));

// chart

animateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const timestamps = processManager.run();
});
