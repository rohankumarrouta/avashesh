import { describe,expect,it } from 'vitest';
import { cloudListingSchema,cloudPriceKg,filterCloudListings,type CloudListing } from '@/lib/cloud-marketplace';
import { signupSchema,safeNext } from '@/lib/account';
const input={waste_type:'paddy_straw',quantity:5,unit:'quintal',price:250,location:'Cuttack',description:'Dry straw',seller_name:'Test seller',seller_contact:'9000000000',photo:'',status:'published'};
const row:CloudListing={...input,id:'test',seller_id:'seller',created_at:'2026-10-27',updated_at:'2026-10-27',is_demo:false};
describe('Shared marketplace',()=>{
 it('enforces positive quantity within 1000 tonnes equivalent',()=>{expect(cloudListingSchema.safeParse({...input,quantity:0}).success).toBe(false);expect(cloudListingSchema.safeParse({...input,quantity:10001}).success).toBe(false);});
 it('rejects negative price and invalid supplied contact',()=>{expect(cloudListingSchema.safeParse({...input,price:-1}).success).toBe(false);expect(cloudListingSchema.safeParse({...input,seller_contact:'123'}).success).toBe(false);});
 it('uses INR per selected unit and kg quantity filter',()=>{expect(cloudPriceKg(row)).toBe(2.5);expect(filterCloudListings([row],{q:'',type:'paddy_straw',location:'cuttack',min:'2.5',max:'2.5',quantity:'500'})).toHaveLength(1);expect(filterCloudListings([row],{q:'',type:'',location:'',min:'',max:'',quantity:'501'})).toHaveLength(0);});
 it.each(['draft','sold','deleted'])('never includes %s listings publicly',status=>{expect(filterCloudListings([{...row,status}],{q:'',type:'',location:'',min:'',max:'',quantity:''})).toEqual([]);});
 it('rejects external return paths',()=>{expect(safeNext('//evil.example')).toBe('');expect(safeNext('/marketplace/sell')).toBe('/marketplace/sell');});
 it('accepts only Farmer and Buyer signup roles',()=>{const account={email:'test@example.com',password:'testing123',display_name:'Test',contact:''};expect(signupSchema.safeParse({...account,role:'farmer'}).success).toBe(true);expect(signupSchema.safeParse({...account,role:'buyer'}).success).toBe(true);expect(signupSchema.safeParse({...account,role:'admin'}).success).toBe(false);});
});