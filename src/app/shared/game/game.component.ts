// Update submitScore method to properly handle observables
submitScore() {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      const playerScore: PlayerScore = {
        playerId: this.authService.getCurrentUserId() || 'guest',
        playerName: this.authService.getCurrentUserName() || 'Guest Player',
        quarterId: this.quarterId,
        score: this.totalScore,
        guesses: this.guesses,
        timestamp: new Date()
      };

      this.firebaseService.submitScore(playerScore).pipe(
        tap(() => {
          console.log('Score submitted successfully');
          this.router.navigate(['/results'], { 
            queryParams: { 
              quarterId: this.quarterId,
              score: this.totalScore 
            }
          });
        }),
        catchError(error => {
          console.error('Error submitting score:', error);
          this.showErrorMessage('Failed to submit score. Please try again.');
          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe();
    }
  }