import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  stateExists: boolean = false;
  ticker: string = "";
  constructor() { }

  updateState(state: boolean){
    this.stateExists = state
  }

  getState(){
    return this.stateExists
  }

  setTicker(ticker: string){
    this.ticker = ticker;
  }

  getTicker(){
    return this.ticker;
  }
}
