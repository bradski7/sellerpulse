# Waitlist Setup (Google Forms - Free)

## Goal
Store waitlist emails without paid tools.

## Steps
1. Create a Google Form with fields:
   - Name (short answer)
   - Email (short answer)
   - Source (short answer, optional)
2. In Google Forms, click **Send** -> link icon.
3. Copy the form URL and change `/viewform` to `/formResponse`.
4. Get entry IDs:
   - Click 3-dot menu -> **Get pre-filled link**
   - Fill sample values and generate link
   - In URL, copy each `entry.xxxxx` key
5. Open `config.js` and set:
   - `googleFormAction`
   - `emailFieldName`
   - `nameFieldName`
   - `sourceFieldName` (optional)
6. Commit/push.

## Example
```js
window.SELLERPULSE_CONFIG = {
  googleFormAction: "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
  emailFieldName: "entry.123456789",
  nameFieldName: "entry.987654321",
  sourceFieldName: "entry.135792468",
  sourceValue: "sellerpulse-landing",
};
```

## Notes
- Form submissions use `no-cors`; browser won't return full response body.
- Success is optimistic UX + form reset.
