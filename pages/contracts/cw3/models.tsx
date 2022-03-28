export class Timelock {
  constructor(
    public admins: string[],
    public proposers: string[],
    public min_time_delay: number
  ) {}
}

export class Operation {
  constructor(
    public id: number,
    public status: 'pending' | 'executed' | 'failed' | '',
    public proposer: string,
    public executors: string[],
    public execution_time: string,
    public target: string,
    public data: string
  ) {}
}
