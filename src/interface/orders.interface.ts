import { boolean, object, string } from "yup"

export interface ITransport{
    code: string
    price: number
    delivery_time: number
}

export interface IUpdateOrder {
    trackingCode?: string
    companyTrackingAreaLink?: string
}

export interface IWebHookData {
	id:string
}

export interface IWebHook {
	action: string,
	api_version: string,
	data: IWebHookData,
	date_created: string,
	id: number,
	live_mode:boolean,
	type: string,
	user_id: string
}

export interface IResponsePreference {
	additional_info: string | null,
	auto_return: string | null, 
	back_urls: {
		failure: string | null,
		pending: string | null,
		success: string | null
	},
	binary_mode: boolean | null,
	client_id: string | null,
	collector_id: number | null,
	coupon_code: string | null,
	coupon_labels: string | null,
	date_created: string | null,
	date_of_expiration: string | null,
	expiration_date_from: string | null,
	expiration_date_to: string | null,
	expires: boolean | null,
	external_reference: string | null,
	id: string | null,
	init_point: string | null,
	internal_metadata: string | null,
	items: [
		{
			id: string | null,
			category_id: string | null,
			currency_id: string | null,
			description: string | null,
			picture_url: string | null,
			title: string | null,
			quantity: number | null,
			unit_price: number | null
		}
	],
	marketplace: string | null,
	marketplace_fee: number | null,
	metadata: object,
	notification_url: string | null,
	operation_type: string | null,
	payer: {
		phone: {
			area_code: string | null,
			number: string | null
		},
		address: {
			zip_code: string | null,
			street_name: string | null,
			street_number: number | null
		},
		email: string | null,
		identification: {
			number: string | null,
			type: string | null
		},
		name: string | null,
		surname: string | null,
		date_created: string | null,
		last_purchase: string | null
	},
	payment_methods: {
		default_card_id: string | null,
		default_payment_method_id: string | null,
		excluded_payment_methods: [
			{
				id: string | null
			}
		],
		excluded_payment_types: [
			{
				id: string | null
			}
		],
		installments: number | null,
		default_installments: number | null
	},
	processing_modes: string | null,
	product_id: string | null,
	redirect_urls: {
		failure: string | null,
		pending: string | null,
		success: string | null
	},
	sandbox_init_point: string | null,
	site_id: string | null,
	shipments: {
		mode: string | null,
		default_shipping_method: string | null,
		cost: number | null,
		receiver_address: {
			zip_code: string | null,
			street_name: string | null,
			street_number: number | null,
			floor: string | null,
			apartment: string | null,
			city_name: string | null,
			state_name: string | null,
			country_name: string | null
		}
	},
	total_amount: number | null,
	last_updated: number | null
}

export interface IResponseGetPayment {
	id:string
	date_created:string
	date_approved:string
	date_last_updated:string
	date_of_expiration:string
	money_release_date:string
	operation_type:string
	issuer_id:string
	payment_method_id:string
	payment_type_id:string
	status:string | number
	status_detail:string
	currency_id:string
	description:string
	live_mode:boolean
	sponsor_id:string
	authorization_code:string
	money_release_schema:string
	counter_currency:string
	collector_id:string
	payer:object
	metadata:{ order_id:string }
	additional_info:object
	external_reference:string
	transaction_amount:number
	transaction_amount_refunded:number
	coupon_amount:number
	differential_pricing_id:string
	deduction_schema:string
	transaction_details:object
	captured:Boolean
	binary_mode:boolean
	call_for_authorize_id:string
	statement_descriptor:string
	installments:number
	card:object
	notification_url:string
	processing_mode:string
	merchant_account_id:string
	acquirer:string
	merchant_number:string
	error?:string
	message?:string
	cause?:{
		code:number
		description:string
		data:string
	}
}