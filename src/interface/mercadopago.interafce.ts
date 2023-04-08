interface Payer {
    id?:string
    first_name?:string
    last_name?:string
    email: string;
    identification?: {
      type: string;
      number: string;
    };
}
  
export interface IItemPayment {
  id: string,
  title: string,
  description: string,
  picture_url: string,
  category_id: string,
  quantity: number,
  unit_price: number
}


interface IAditionalInfo {
  payer?: {
    first_name?: string,
    last_name?: string,
    email?: string,
    identification?: {
      type?: string,
      number?: string
    },
    phone?: {
      area_code?: string,
      number?: string
    },
    address?: {
      zip_code?: string,
      street_name?: string,
      street_number?: string
    }
  },
  shipments?: {
    receiver_address?: {
      zip_code: string;
      street_name: string;
      city_name:string
      state_name:string
      street_number: string;
      floor?: string;
      apartment?: string;
    }
  },
  items?: IItemPayment[],
  payer_index?: number
}

  
export interface PaymentCreatePayload {
    payer: Payer;
    external_reference?: string;
    notification_url?: string;
    sponsor_id?: number;
    statement_descriptor?: string;
    description?: string;
    metadata?: object;
    auto_return?: string;
    back_urls?: {
      success?: string;
      pending?: string;
      failure?: string;
    };
    transaction_amount?: number;
    date_of_expiration:string
    coupon_amount?: number;
    differential_pricing_id?: number;
    application_fee?: number;
    capture?: boolean;
    payment_method_id?: string;
    issuer_id?: string;
    token?: string;
    installments?: number;
    binary_mode?: boolean;
    additional_info?:IAditionalInfo
}




export interface PaymentUpdatePayload {
  capture?: string
  status?: string
  transaction_amount?: number
}




export interface CardData {
    card_number: string;
    security_code: string;
    expiration_month: number;
    expiration_year: number;
    cardholder: {
      name: string;
      identification: {
        type: string;
        number: string;
      };
    };
  }



export interface MercadoPagoCardTokenResponse {
    id: string;
    public_key: string;
    card_id: string;
    status: string;
    used_date: string | null;
    date_created: string;
    date_last_updated: string;
    card_number_length: number;
    luhn_validation: boolean;
    cardholder: {
      name: string;
      identification: {
        type: string;
        number: string;
      };
    };
    require_esc: boolean;
    security_code_length: number;
    card_number: string;
}

  
  
  
  
export interface PaymentCreationResponse {
  id: string;
  status: string; 
  status_detail: string;
  transaction_amount: number;
  currency_id: string; 
  date_created: string; 
  date_approved: string | null; 
  date_last_updated: string;
  payment_type_id: string;
  payment_method_id: string; 
  issuer_id: string | null; 
  installments: number; 
  description: string | null;
  notification_url: string | null; 
  external_reference: string | null; 
  statement_descriptor: string | null; 
  live_mode: boolean;
  sponsor_id: number | null;
  binary_mode: boolean; 
  order: {
    type: string; 
    id: string; 
  };
  metadata: any | null; 
  additional_info: {
    items: Array<{
      id: string | number; 
      title: string; 
      description: string | null; 
      picture_url: string | null; 
      category_id: string | null; 
      quantity: number; 
      unit_price: number;
    }>;
    payer: {
      first_name: string; 
      last_name: string;
      email: string;
      phone: {
        area_code: string; 
        number: string; 
      };
      identification: {
        type: string;
        number: string;
      };
      address: {
        zip_code: string;
        street_name: string;

      }
    }
  }
}

