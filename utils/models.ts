export class LockBox {
  id: string
  native_denom: string
  cw20_addr: string
  owner: string
  reset: boolean
  total_amount: string
  expiration: { at_height: string; at_time: string }
  claims: { addr: string; amount: string }[]
  constructor(
    id: string,
    native_denom: string,
    cw20_addr: string,
    owner: string,
    resetted: boolean,
    total_amount: string,
    expiration: { at_height: string; at_time: string },
    claims: { addr: string; amount: string }[]
  ) {
    this.id = id
    this.native_denom = native_denom
    this.cw20_addr = cw20_addr
    this.owner = owner
    this.reset = resetted
    this.total_amount = total_amount
    this.expiration = expiration
    this.claims = claims
  }
}
