# Avashesh — Sample data

**SAMPLE / FICTIONAL ONLY.** These examples are not real sellers, stock, market prices, farmers or transactions. Project credit: Team Avashesh. No phone numbers, account credentials or real personal information are provided.

## Existing marketplace test fixture

`src/data/sample-listings.json` contains three legacy local-demo examples; it is used by pure tests, not seeded into the shared database or shown as available real stock.

| SAMPLE material | Quantity | Illustrative asking price | Illustrative location |
|---|---:|---:|---|
| Paddy straw | 5 quintal | ₹250/quintal | Cuttack, Odisha |
| Coconut husk | 300 kg | ₹3/kg | Puri, Odisha |
| Other crop residue | 1 tonne | ₹1,800/tonne | Bargarh, Odisha |

All are marked `isDemo: true`, have empty contact values, and explicitly fictional seller labels. Do not import them as published shared records: the current database allows `is_demo=false` only and requires authenticated real ownership.

## Shared listing shape example (not import-ready)

```json
{
  "waste_type": "paddy_straw",
  "quantity": 5,
  "unit": "quintal",
  "price": 250,
  "location": "Cuttack, Odisha — SAMPLE",
  "description": "SAMPLE only: fictional dry straw for demonstration.",
  "seller_name": "SAMPLE seller — fictional",
  "seller_contact": "",
  "photo": "",
  "status": "draft"
}
```

Empty seller contact intentionally makes this unsuitable for submission. A real authenticated Farmer supplies their own valid contact with informed awareness of public visibility, while the server supplies their seller ID. No made-up callable number or user UUID is included.

## Inquiry shape example (not import-ready)

```json
{
  "buyerName": "SAMPLE Buyer — fictional",
  "contact": "",
  "message": "SAMPLE inquiry: Is this residue suitable for composting?"
}
```

A real Buyer must supply their own valid phone/email. Server attaches authenticated Buyer ID and a real listing ID. This document does not send or seed inquiries.

## Existing local waste sample records

`src/data/sample-records.json` contains five fictional entries loaded only through Load sample data:

| Material | Kg | District | Handling | Planned reuse |
|---|---:|---|---|---|
| Paddy straw | 1500 | Bargarh | Burning | Incorporation |
| Coconut husk | 300 | Puri | Dumped | Cocopeat |
| Paddy straw | 120 | Cuttack | Left | None |
| Vegetable waste | 40 | Khordha | Dumped | Vermicompost |
| Groundnut shells | 250 | Ganjam | Unsure | None |

Every entry has `isDemo: true` and SAMPLE notes. Dashboard totals may include these explicitly labelled examples; they are not proof of farmer participation or waste reuse. Emission estimates use cited assumptions, not measurements.