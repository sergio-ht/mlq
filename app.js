const form = document.querySelector("form");
const tbody = document.querySelector("tbody");
const burstTime = document.getElementById("burst-time");
const processType = document.getElementById("process-type");
const arrivalTime = document.getElementById("arrival-time");

// global variables
let processId = 0;

// queues
const systemQueue = [];
const interactiveQueue = [];
const batchQueue = [];

class Process {
  constructor(id, burstTime, arrivalTime) {
    this.id = id;
    this.burstTime = burstTime;
    this.arrivalTime = arrivalTime;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // add process to appropiate queue
  if (processType.value === "Proceso de Sistema")
    systemQueue.push(new Process(processId++, burstTime.value, arrivalTime));
  else if (processType.value === "Proceso Interactivo")
    interactiveQueue.push(
      new Process(processId++, burstTime.value, arrivalTime)
    );
  else if (processType.value === "Proceso por Lotes")
    batchQueue.push(new Process(processId++, burstTime.value, arrivalTime));

  // clear inputs
  burstTime.value = "";
});

// planning algorithms
const fcfs = (queue) => queue.sort((a, b) => a.arrivalTime - b.arrivalTime);
