import { Component, inject } from "@angular/core";
import { FormComponent } from "../../../template/main/form/form.component";
import { ActivatedRoute, Router } from "@angular/router";
import { GetOrderService } from "../../../../services/order/get-order.service";
import { PutOrderService } from "../../../../services/order/put-order.service";
import { IOrderResponse } from "../../../../interfaces/order/order.response.interfaz";
import { IOrderRequest } from "../../../../interfaces/order/order.request.interface";

@Component({
  selector: "app-update-order",
  imports: [FormComponent],
  templateUrl: "./update-order.component.html"
})
export class UpdateOrderComponent {
  formContent = {
    title: "Actualizar pedido",
    fields: [
      {
        key: "date",
        label: "Fecha del pedido",
        placeholder: "Ingresa la fecha del pedido",
        type: "date",
        errorMessage: "No ha ingresado el dato",
      },
      {
        key: "clientId",
        label: "Id del Cliente",
        placeholder: "Ingresa el id del cliente",
        type: "number",
        errorMessage: "No ha ingresado el dato",
      },
    ],
    dynamicField: {
      key: "dishId",
      label: "Plato",
      placeholder: "Ingresa el id del plato",
      type: "number",
      errorMessage: "No ha ingresado el dato",
    },
  };

  id: string | null = null;

  initialStaticData: { key: keyof IOrderRequest; content: Date | string | number }[] = [];
  initialDynamicData: { key: string; content: string | number, quantity: number }[] = [];

  router = inject(Router);
  route = inject(ActivatedRoute);
  getOrderService = inject(GetOrderService);
  putOrderService = inject(PutOrderService);

  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('id');
    this.getOrderService.execute(this.id!).subscribe((response)=>{
      this.initialStaticData = [
        { key: 'date', content: response.date },
        { key: 'clientId', content: response.client?.id || '' } 
      ];
      this.initialDynamicData = [];
      if (Array.isArray(response.dishes)) {
        response.dishes.forEach(dish => {
          this.initialDynamicData.push(
            { key: 'dishId', content: dish.dishId, quantity: dish.quantity },
          );
        });
      }
    })
  }  

  updateMenu(id:string, orderData: IOrderRequest): void{
    this.putOrderService.execute(id,orderData).subscribe(()=>{
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
  
  onSendForm(event: any){
    const orderRequest: IOrderRequest = {
      clientId: 0,
      dishes: [],
      date: new Date(),
    };

    orderRequest.clientId = event.clientId;
    orderRequest.date = event.date;
    orderRequest.dishes = event.dishes;
    this.updateMenu(this.id!, orderRequest);
  }
}
