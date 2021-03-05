import { Component, ViewChild, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { Periodicity } from 'src/app/model/core/period';
import { TransferToComponent } from '../accounts/transfer-to.component';
import { RegularTransferComponent } from '../transfer/regular-transfer.component';
import { AllocationComponent, FixedAllocationsStrategyComponent } from './fixed-allocation.strategy.component';

@Component({
  selector: 'parent',
  template: 'to-be-defined'
})
class TestWrapperComponent {
  @ViewChild(FixedAllocationsStrategyComponent, {static: true})
  public fixedAllocationStrategyComponent: FixedAllocationsStrategyComponent;
}

describe('FixedAllocationsStrategyComponent', () => {
  let component: FixedAllocationsStrategyComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TestWrapperComponent,
        FixedAllocationsStrategyComponent,
        AllocationComponent,
        RegularTransferComponent,
        TransferToComponent,
      ]
    });
  }));

  it('Can instantiate a Fixed Allocation Strategy without transfer', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <fixed-allocations periodicity="MONTHLY" threshold="5">
            <allocation assetName="ASS1" allocation="30"></allocation>
            <allocation assetName="ASS2" allocation="20"></allocation>
            <allocation assetName="ASS3" allocation="10"></allocation>
          </fixed-allocations>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.fixedAllocationStrategyComponent;
      expect(component).toBeTruthy();

      let fixedAllocationsStrategy = component.asStrategy();

      expect(fixedAllocationsStrategy.fixedAllocations).toEqual(jasmine.arrayWithExactContents([
        {assetName: "ASS1", allocation: 30},
        {assetName: "ASS2", allocation: 20},
        {assetName: "ASS3", allocation: 10},
      ]));

      expect(fixedAllocationsStrategy.transfer.transfer).toBe(0);
      expect(fixedAllocationsStrategy.period.periodicity).toBe(Periodicity.MONTHLY)
      expect(fixedAllocationsStrategy.threshold).toBe(5);
  });

  it('Can instantiate a Fixed Allocation Strategy with transfer', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <fixed-allocations periodicity="YEARLY" threshold="15">
            <allocation assetName="ASS1" allocation="30"></allocation>
            <regular-transfer transfer="1000" every="MONTH">
              <to-account id="LIFE_STYLE"></to-account>
            </regular-transfer>
          </fixed-allocations>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.fixedAllocationStrategyComponent;
      expect(component).toBeTruthy();

      let fixedAllocationsStrategy = component.asStrategy();

      expect(fixedAllocationsStrategy.fixedAllocations.length).toBe(1);
      expect(fixedAllocationsStrategy.transfer.transfer).toBe(1000);
      expect(fixedAllocationsStrategy.period.periodicity).toBe(Periodicity.YEARLY)
      expect(fixedAllocationsStrategy.threshold).toBe(15);
  });

});
