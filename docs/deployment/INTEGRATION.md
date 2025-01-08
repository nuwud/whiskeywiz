# WhiskeyWiz Shopify Integration Guide

## Quick Start

1. Add the WhiskeyWiz script to your theme.liquid file:
```html
<!-- WhiskeyWiz Integration -->
<script src="https://whiskeywiz2.web.app/elements/whiskey-wiz.js" defer></script>
```

2. Add the game component to your product page or custom section:
```html
<whiskey-wiz-game 
  quarter-id="{{ quarter_id }}" 
  class="whiskey-wiz-container">
</whiskey-wiz-game>
```

## Styling Options

### Custom CSS Variables
The game supports these CSS variables for customization:
```css
.whiskey-wiz-container {
  --ww-primary: #FFD700;      /* Primary color */
  --ww-background: #1A1A1A;   /* Background color */
  --ww-text: #FFFFFF;         /* Text color */
}
```

### Responsive Design
The game container is responsive by default. You can control its size:
```css
whiskey-wiz-game {
  max-width: 800px;
  margin: 0 auto;
  display: block;
}
```

## Advanced Configuration

### Quarter ID Format
- Format: MMYY (e.g., "0124" for January 2024)
- Dynamic assignment: `quarter-id="Q{{ 'now' | date: '%m%y' }}"`

### Error Handling
The component includes built-in error handling and will display user-friendly messages if:
- The game fails to load
- The quarter ID is invalid
- The connection is lost

### Performance Notes
- The game uses lazy loading
- Assets are loaded only when the component is visible
- State is preserved across page navigations

## Testing Integration

1. Verify the script is loading:
```javascript
console.log(customElements.get('whiskey-wiz-game')); // Should return constructor
```

2. Check for proper initialization:
```html
<whiskey-wiz-game quarter-id="0124" onload="console.log('Game loaded')">
</whiskey-wiz-game>
```

3. Verify state preservation:
- Navigate away from the page and back
- Game state should be preserved

## Troubleshooting

Common issues and solutions:

1. Script not loading:
- Check CORS headers
- Verify script URL
- Check browser console for errors

2. Game not displaying:
- Verify quarter ID format
- Check container visibility
- Inspect shadow DOM for errors

3. Style conflicts:
- Use shadow DOM inspector
- Check for CSS reset conflicts
- Verify theme compatibility

## Support

For technical support:
- GitHub Issues: https://github.com/nuwud/whiskeywiz/issues
- Documentation: https://whiskeywiz2.web.app/docs