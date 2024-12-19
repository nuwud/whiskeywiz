# Whiskey Wiz Integration Instructions

## Admin Panel Integration
Add this code to your Shopify page where you want the admin panel:
\\\html
<whiskey-wiz-admin></whiskey-wiz-admin>
\\\

## Quarter Game Integration
Add these tags where you want to embed specific quarter games:

### 2022

\\\html
<whiskey-wiz-0322></whiskey-wiz-0322> <!-- Q1 2022 -->
\\\`n
\\\html
<whiskey-wiz-0122></whiskey-wiz-0122> <!-- Q1 2022 -->
\\\`n
\\\html
<whiskey-wiz-0622></whiskey-wiz-0622> <!-- Q2 2022 -->
\\\`n
\\\html
<whiskey-wiz-0922></whiskey-wiz-0922> <!-- Q3 2022 -->
\\\`n
\\\html
<whiskey-wiz-1222></whiskey-wiz-1222> <!-- Q4 2022 -->
\\\`n
### 2023

\\\html
<whiskey-wiz-0323></whiskey-wiz-0323> <!-- Q1 2023 -->
\\\`n
\\\html
<whiskey-wiz-0623></whiskey-wiz-0623> <!-- Q2 2023 -->
\\\`n
\\\html
<whiskey-wiz-0923></whiskey-wiz-0923> <!-- Q3 2023 -->
\\\`n
\\\html
<whiskey-wiz-1223></whiskey-wiz-1223> <!-- Q4 2023 -->
\\\`n
### 2024

\\\html
<whiskey-wiz-0324></whiskey-wiz-0324> <!-- Q1 2024 -->
\\\`n
\\\html
<whiskey-wiz-0624></whiskey-wiz-0624> <!-- Q2 2024 -->
\\\`n
\\\html
<whiskey-wiz-0924></whiskey-wiz-0924> <!-- Q3 2024 -->
\\\`n
\\\html
<whiskey-wiz-1224></whiskey-wiz-1224> <!-- Q4 2024 -->
\\\`n
### 2025

\\\html
<whiskey-wiz-0325></whiskey-wiz-0325> <!-- Q1 2025 -->
\\\`n
\\\html
<whiskey-wiz-0625></whiskey-wiz-0625> <!-- Q2 2025 -->
\\\`n
\\\html
<whiskey-wiz-0925></whiskey-wiz-0925> <!-- Q3 2025 -->
\\\`n
\\\html
<whiskey-wiz-1225></whiskey-wiz-1225> <!-- Q4 2025 -->
\\\`n
### 2026

\\\html
<whiskey-wiz-0326></whiskey-wiz-0326> <!-- Q1 2026 -->
\\\`n
\\\html
<whiskey-wiz-0626></whiskey-wiz-0626> <!-- Q2 2026 -->
\\\`n
\\\html
<whiskey-wiz-0926></whiskey-wiz-0926> <!-- Q3 2026 -->
\\\`n
## Required Scripts
Add this script to your Shopify theme.liquid file:
\\\html
<!-- Whiskey Wiz Dependencies -->
<script src="{{ 'whiskey-wiz.js' | asset_url }}" type="text/javascript" async></script>
\\\

## Important Notes
* Upload whiskey-wiz.js to Shopify's Files section (Settings > Files)
* The admin panel should only be embedded on admin-specific pages
* Each quarter component can be embedded independently
* Components will automatically handle authentication
* Changes made in admin panel affect all embedded instances
* Make sure to configure Firebase authentication settings
