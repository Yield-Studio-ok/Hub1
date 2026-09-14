import { Injectable } from "@nestjs/common";
import * as si from "systeminformation";

@Injectable()
export class InfraService {
  async getVpsStatus() {
    const [load, mem, procs] = await Promise.all([si.currentLoad(), si.mem(), si.processes()]);

    const topProcesses = procs.list
      .toSorted((a, b) => b.cpu - a.cpu)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        cpu: p.cpu,
        mem: p.mem,
      }));

    return {
      cpuUsage: load.currentLoad,
      freeRam: Math.round(mem.free / (1024 * 1024)),
      topProcesses,
    };
  }
}
