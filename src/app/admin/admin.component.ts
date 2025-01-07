import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ShopifyService } from '../services/shopify.service';
import { Quarter, Sample, ShopifyProduct, MashbillType } from '../shared/models/quarter.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

interface ScoringRules {
  agePerfectScore: number;
  ageBonus: number;
  agePenaltyPerYear: number;
  proofPerfectScore: number;
  proofBonus: number;
  proofPenaltyPerPoint: number;
  mashbillCorrectScore: number;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  scoringRules: ScoringRules = this.getDefaultScoringRules();
  sampleNumbers = [1, 2, 3, 4];
  private subscriptions: Subscription[] = [];
  products$: Observable<ShopifyProduct[]>;
  
  readonly mashbillTypes: MashbillType[] = [
    'Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Blend', 'Specialty'
  ];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private shopifyService: ShopifyService
  ) {
    this.products$ = new BehaviorSubject<ShopifyProduct[]>([]);
    this.refreshProducts();
  }

  ngOnInit() {
    this.loadQuarters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private getDefaultScoringRules(): ScoringRules {
    return {
      agePerfectScore: 30,
      ageBonus: 10,
      agePenaltyPerYear: 4,
      proofPerfectScore: 30,
      proofBonus: 10,
      proofPenaltyPerPoint: 2,
      mashbillCorrectScore: 10
    };
  }

  private loadQuarters() {
    const quartersSub = this.firebaseService.getAllQuarters()
      .subscribe(quarters => {
        this.quarters = quarters;
      });
    this.subscriptions.push(quartersSub);
  }

  selectQuarter(quarter: Quarter) {
    this.selectedQuarter = { ...quarter };
  }

  showScoringRules() {
    this.selectedQuarter = null;
  }

  updateScoringRules() {
    // Implementation for updating scoring rules
  }

  refreshProducts() {
    const productsSub = this.shopifyService.getProducts()
      .pipe(take(1))
      .subscribe(products => {
        (this.products$ as BehaviorSubject<ShopifyProduct[]>).next(products);
      });
    this.subscriptions.push(productsSub);
  }

  onProductSelect(product: ShopifyProduct | null, sampleNumber: number) {
    if (!this.selectedQuarter) return;
    
    const sampleKey = `sample${sampleNumber}` as keyof typeof this.selectedQuarter.samples;
    if (product) {
      this.selectedQuarter.samples[sampleKey].shopifyProduct = product;
    } else {
      delete this.selectedQuarter.samples[sampleKey].shopifyProduct;
    }
  }

  async updateQuarter() {
    if (!this.selectedQuarter || !this.isQuarterValid()) return;

    try {
      await this.firebaseService.updateQuarter(this.selectedQuarter);
      this.loadQuarters();
    } catch (error) {
      console.error('Error updating quarter:', error);
      // Handle error (show message to user)
    }
  }

  isQuarterValid(): boolean {
    if (!this.selectedQuarter) return false;

    return this.sampleNumbers.every(num => {
      const sample = this.selectedQuarter!.samples[`sample${num}` as keyof typeof this.selectedQuarter!.samples];
      return this.isSampleValid(sample);
    });
  }

  private isSampleValid(sample: Sample): boolean {
    return !!(
      sample &&
      typeof sample.age === 'number' && sample.age > 0 &&
      typeof sample.proof === 'number' && sample.proof >= 80 &&
      sample.mashbill &&
      (!sample.shopifyProduct || sample.shopifyProduct.id)
    );
  }

  navigateToQuarter(quarterId: string) {
    this.router.navigate(['/quarters', quarterId]);
  }

  copyToClipboard(type: 'script') {
    // Implementation for copying integration code
  }
}