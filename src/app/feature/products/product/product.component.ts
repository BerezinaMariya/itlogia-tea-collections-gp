import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ProductService} from "../../../shared/services/product.service";
import {EMPTY, mergeMap, Observable, Subscription} from "rxjs";
import {ProductType} from "../../../types/product.type";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  product: ProductType;
  private subscription: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router) {
    this.product = {
      id: 0,
      image: '',
      title: '',
      description: '',
      price: 0
    }
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params
      .pipe(
        mergeMap((params: Params): Observable<ProductType> => {
          if (params['id']) {
            this.productService.getProduct(+params['id'])
          }
          return EMPTY;
        })
      ).subscribe({
        next: ((data: ProductType) => {
          if (data) {
            this.product = data;
          }
        }),
        error: (error => {
          this.router.navigate(['/']);
        })
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
