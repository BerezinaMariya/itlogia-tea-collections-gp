import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProductService} from "../../shared/services/product.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit, OnDestroy {
  orderForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[А-ЯЁа-яё]+$')]],
    last_name: ['', [Validators.required, Validators.pattern('^[А-ЯЁа-яё]+$')]],
    phone: ['', [Validators.required, Validators.pattern('^\\+?(\\d){11}$')]],
    country: ['', Validators.required],
    zip: ['', Validators.required],
    product: [{value: '', disabled: true}, Validators.required],
    address: ['', [Validators.required, Validators.pattern('^[А-ЯЁа-яё0-9\\s-/]+$')]],
    comment: ['']
  });

  get name() {
    return this.orderForm.get('name');
  };

  get last_name() {
    return this.orderForm.get('last_name');
  };

  get phone() {
    return this.orderForm.get('phone');
  };

  get country() {
    return this.orderForm.get('country');
  };

  get zip() {
    return this.orderForm.get('zip');
  };

  get product() {
    return this.orderForm.get('product');
  };

  get address() {
    return this.orderForm.get('address');
  };

  private subscriptionOrder: Subscription | null = null;

  isLoading: boolean = false;
  isSuccessMessageVisible: boolean = false;
  isFailMessageVisible: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private fb: FormBuilder) {
    // constructor(private activatedRoute: ActivatedRoute) {
  }
  //
  ngOnInit(): void {
    const productParam = this.activatedRoute.snapshot.queryParamMap.get('product');

    if (productParam && this.orderForm) {
      this.orderForm.patchValue({
        product: productParam
      });
    }
  }
  //
  ngOnDestroy() {
    this.subscriptionOrder?.unsubscribe();
  }

  showFail() {
    this.isFailMessageVisible = true;

    setTimeout(() => {
      this.isFailMessageVisible = false;
    }, 3000);
  }

  createOrder() {
    if (this.orderForm.controls.name.value && this.orderForm.controls.last_name.value && this.orderForm.controls.phone.value
      && this.orderForm.controls.country.value && this.orderForm.controls.zip.value
      && this.orderForm.controls.product.value && this.orderForm.controls.address.value && this.orderForm.valid) {

      this.isLoading = true;

      this.subscriptionOrder = this.productService.createOrder({
        name: this.orderForm.controls.name.value,
        last_name: this.orderForm.controls.last_name.value,
        phone: this.orderForm.controls.phone.value,
        country: this.orderForm.controls.country.value,
        zip: this.orderForm.controls.zip.value,
        product: this.orderForm.controls.product.value,
        address: this.orderForm.controls.address.value,
        comment: this.orderForm.controls.comment.value
      })
        .subscribe({
          next: (response) => {
            if (response.success === 1) {
              this.isSuccessMessageVisible = true;
              this.orderForm.reset();
              this.isLoading = false;
            }
          },
          error: () => {
            this.showFail();
            this.isLoading = false;
          }
        });
    } else {
      this.showFail();
    }
  }
}
