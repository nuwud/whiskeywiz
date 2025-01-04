// Previous code remains the same...

  navigateToQuarter(quarterId: string) {
    this.router.navigate(['/game'], { queryParams: { quarter: quarterId } });
  }

// Rest of the code remains the same...