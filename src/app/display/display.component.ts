import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock/stock.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  data: any;
  constructor(private stockService:StockService) { }

  ngOnInit() {
    this.stockService.getStockData().subscribe(data => {
      this.data = data;
    });
  }
}
