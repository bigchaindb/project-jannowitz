import { Component, OnInit } from '@angular/core';
import { BdbService } from '../shared/bdb.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private bdbService: BdbService) { }

  public tx;
  public keypair;

  ngOnInit() {
    this.keypair = this.bdbService.getKeypair();
  }

  public createTransaction(inputs) {
    const asset = {yourAsset: inputs.value.data};
    const metadata = {yourMeta: inputs.value.metadata};
    this.bdbService.createNewAsset(this.keypair, asset, metadata).then(tx => this.tx = tx);
  }
}
