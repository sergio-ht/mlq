const form = document.querySelector("form");
const tbody = document.querySelector("tbody");
const burstTime = document.getElementById("burst-time");
const processType = document.getElementById("process-type");

// global variables
let processId = 0;

// queues
const systemQueue = [];
const interactiveQueue = [];
const batchQueue = [];

class Process {
  constructor(id, burstTime) {
    this.id = id;
    this.burstTime = burstTime;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // add process to appropiate queue
  if (processType.value === "Proceso de Sistema")
    systemQueue.push(new Process(processId++, burstTime.value));
  else if (processType.value === "Proceso Interactivo")
    interactiveQueue.push(new Process(processId++, burstTime.value));
  else if (processType.value === "Proceso por Lotes")
    batchQueue.push(new Process(processId++, burstTime.value));
});
