import { Component } from '@angular/core';
import { iProduct } from '../../Models/iproduct';
import { ProductsService } from '../../services/products.service';
import { FavouritesService } from '../../services/favourites.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  products:iProduct[]=[]

  constructor(
    private productSvc: ProductsService,
    private favouritesSvc: FavouritesService
  ) {}

  ngOnInit(): void {
    this.productSvc.getProducts().subscribe(response => {
      this.products = response.products;
    });
  }

  addToFavourites(product: iProduct): void {
    this.favouritesSvc.addToFavourites(product);
  }

  removeFromFavourites(product: iProduct): void {
    this.favouritesSvc.removeFromFavourites(product);
  }

  get favourites(): iProduct[] {
    return this.favouritesSvc.getFavourites();
  }

  isInFavourites(product: iProduct): boolean {
    return this.favourites.some(item => item.id === product.id);
  }
}