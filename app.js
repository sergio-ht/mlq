const form = document.querySelector("form");
const tbody = document.querySelector("tbody");
const burstTime = document.getElementById("burst-time");
const processType = document.getElementById("process-type");

// queues
const systemQueue = [];
const interactiveQueue = [];
const batchQueue = [];

class Process {
  constructor(burstTime) {
    this.burstTime = burstTime;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // add process to appropiate queue
  if (processType.value === "Proceso de Sistema")
    systemQueue.push(new Process(burstTime.value));
  else if (processType.value === "Proceso Interactivo")
    interactiveQueue.push(new Process(burstTime.value));
  else if (processType.value === "Proceso por Lotes")
    batchQueue.push(new Process(burstTime.value));
});
