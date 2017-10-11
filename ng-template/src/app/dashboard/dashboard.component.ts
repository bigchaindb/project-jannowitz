import { Component, OnInit } from '@angular/core';
import { BdbService } from '../shared/bdb.service'
import { Asset } from '../models/asset.model'
import { Metadata } from '../models/metadata.model'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private bdbService: BdbService) { }

  public txIds: string[]
  private keypair

  ngOnInit() {
    this.txIds = []
    this.keypair = this.bdbService.getKeypairFromSeed('demo')
  }

  public createTransaction() {
    console.log('123')
    const asset = new Asset()
    asset.ns = 'ng-template-demo'
    const metadata = new Metadata()
    metadata.event = 'ng-template-demo-asset-create'
    this.bdbService.createNewAsset(this.keypair, asset, metadata).then(tx => this.txIds.push(tx.id))
  }
}
