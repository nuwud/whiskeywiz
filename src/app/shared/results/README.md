# Results Component Documentation

## Score Sharing Implementation
The results component includes a comprehensive score sharing system that:

1. Primary Sharing Method:
   - Uses Web Share API on supported platforms
   - Falls back to clipboard copying on unsupported platforms
   - Includes score and emoji-based performance indicators

2. Analytics Integration:
   - Tracks share attempts
   - Records successful shares with method used
   - Logs share failures with error details

3. Share Text Format:
   - Displays total score
   - Uses emojis to represent performance on each sample
   - Optional inclusion of game URL

4. Error Handling:
   - Graceful fallbacks for unsupported features
   - User feedback for success/failure
   - Loading states during share process

## Usage
The share functionality is initiated via the `handleShare()` method, which can be triggered through:
1. The share button in the results view
2. Programmatically calling `handleShare()`

## Example Share Output
```
Whiskey Wiz Score: 85
🟨🟧🟨🟨
```

## Analytics Events
- share_attempt: When user initiates sharing
- share_success: When sharing completes (includes method)
- share_failed: When sharing fails (includes error details)