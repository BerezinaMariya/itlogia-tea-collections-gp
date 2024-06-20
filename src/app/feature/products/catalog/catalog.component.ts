import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ProductType} from "../../../types/product.type";
import {mergeMap, Subscription, tap} from "rxjs";
import {ProductService} from "../../../shared/services/product.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {
  public products: ProductType[] = [];
  private searchValue: string = '';
  catalogTitle: string = 'Наши чайные коллекции';
  loading: boolean = false;

  private subscription: Subscription | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams
      .pipe(
        mergeMap((params: Params) => {
          this.searchValue = params['search'];
          this.loading = true;
          return this.productService.getProducts(this.searchValue);
        }),
        tap(() => {
          this.loading = false;
        })
      ).subscribe(
        {
          next: (data: ProductType[]) => {
            this.products = data;
            this.setCatalogTitle();
          },
          error: (error) => {
            console.log(error);
            this.router.navigate(['/']);
          }
        }
      );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  setCatalogTitle() {
    if (!this.searchValue && this.products.length !== 0) {
      this.catalogTitle = 'Наши чайные коллекции';
    } else if (this.searchValue && this.products.length === 0) {
      this.catalogTitle = 'Ничего не найдено';
    } else if (this.searchValue && this.products.length !== 0) {
      this.catalogTitle = 'Результаты поиска по запросу "' + this.searchValue + '"';
    }
  }
}
