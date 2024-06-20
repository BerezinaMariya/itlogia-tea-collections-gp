import {Injectable} from '@angular/core';
import {ProductType} from "../../types/product.type";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrderType} from "../../types/order.type";

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(subject: string): Observable<ProductType[]> {
    let params = new HttpParams();

    if (subject) {
      params = params.set('search', subject);
    }

    return this.http.get<ProductType[]>('https://testologia.ru/tea', {
      params: params
    });
  }

  getProduct(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`https://testologia.ru/tea?id=${id}`);
  }

  createOrder(data: OrderType) {
    return this.http.post<{ success: number, message: string }>(`https://testologia.ru/order-tea`, data);
  }
}
