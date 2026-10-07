# One-click brief → Akash's WhatsApp (Meta WhatsApp Cloud API)

When a visitor presses **Send to Akash**, `api/send-brief.js` sends Akash a WhatsApp message from a
business number using Meta's official WhatsApp Cloud API. The message holds the visitor's name, number,
event, date, venue, needs and notes, plus a **Reply on WhatsApp** button. The visitor never leaves the site.

Meta needs three things from you, which only a Meta account owner can create:
a **WhatsApp app**, a **permanent access token**, and an approved **message template**.
Meta's screens get renamed now and then; if a label below doesn't match exactly, look for the closest one.

---

## A. Create the WhatsApp app (about 10 minutes, on a computer)

1. Go to **<https://developers.facebook.com/apps>** and log in with Facebook. Click **Create app**.
2. Pick the use case **"Connect with customers through WhatsApp"** (if asked for an app type, choose
   **Business**). Name it `Akash Portfolio`. When asked for a business portfolio, create one (e.g. `akshthetics`).
3. In the app, open **WhatsApp → API Setup**. Meta gives you a free **test number** to send from.
   Copy these two values from that page:
   - **Phone number ID**
   - **WhatsApp Business Account ID**
4. Under **To**, choose **Manage phone number list → Add phone number**, enter **+91 89393 31561**
   (Akash), and type in the code Meta sends to Akash's WhatsApp.
5. Press **Send message**. Akash should get Meta's "Hello World" on WhatsApp. That proves the pipe works.

The test number can message up to 5 verified numbers. That's all you need, because it only ever messages Akash.

## B. Make a permanent access token (about 3 minutes)

The token on the API Setup page expires after 24 hours, so make one that doesn't:

1. Go to **<https://business.facebook.com/settings>** → **Users → System users** → **Add**.
   Name `portfolio-bot`, role **Admin**.
2. **Assign assets**: under **Apps**, pick `Akash Portfolio` → **Full control**. Under
   **WhatsApp accounts**, pick the test account → **Full control**.
3. **Generate new token** → app `Akash Portfolio` → expiry **Never** → tick
   `whatsapp_business_messaging` and `whatsapp_business_management` → **Generate**. Copy it; it's shown once.

Keep this token secret. It goes only into Vercel's settings, never into the website code or GitHub.

## C. Hand over (pick one)

**Easiest:** send Claude the **token**, the **Phone number ID** and the **WhatsApp Business Account ID**.
Claude submits the template, waits for approval, adds the keys to Vercel and sends a test brief.

**Or do it yourself:**

```bash
cd akash-portfolio
export WHATSAPP_TOKEN=…  WHATSAPP_PHONE_NUMBER_ID=…  WHATSAPP_WABA_ID=…
node scripts/whatsapp-setup.mjs check            # token and number OK?
node scripts/whatsapp-setup.mjs create-template  # submits "shoot_enquiry" for approval
node scripts/whatsapp-setup.mjs status           # repeat until it says APPROVED (usually minutes)
node scripts/whatsapp-setup.mjs test             # Akash receives a sample brief
```

Then in **Vercel → akash-portfolio → Settings → Environment Variables** (Production) add
`WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`, and **redeploy**. Done: the site's Send button now
delivers through Meta.

## The message template

`create-template` submits this as a **Utility** template named `shoot_enquiry` (English):

> **New shoot enquiry**
>
> You have a new shoot enquiry from your portfolio website.
>
> Name: {{1}} · WhatsApp: {{2}} · Event: {{3}} · Date: {{4}} · Venue: {{5}} · Need: {{6}} · Details: {{7}}
>
> Tap the button below to reply to them on WhatsApp.
>
> *akshthetics.jpg portfolio* · [Reply on WhatsApp → wa.me/{{visitor}}]

(Each field is on its own line in the real message.) WhatsApp only lets a business start a chat with
an approved template; the visitor's answers fill the `{{n}}` slots.

## Good to know

- **Cost:** Meta's test number is meant for development and is free to use. If Akash later adds a real
  number (WhatsApp Manager → Phone numbers; it needs a SIM that isn't already on WhatsApp), Meta charges
  per template message; utility messages in India are listed at about ₹0.115 each.
- **If something breaks:** the site never loses an enquiry. When delivery fails, the visitor's WhatsApp
  opens with the brief typed out instead. CallMeBot (`CALLMEBOT_APIKEY`) also works as a backup sender
  if that key is ever set.
- **Logs:** Vercel → akash-portfolio → Logs shows Meta's exact error if a send is refused.
