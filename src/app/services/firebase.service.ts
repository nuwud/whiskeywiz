    ));
  }

  // Private Helper Methods
  private validateQuarters(quarters: Quarter[]): Quarter[] {
    return quarters.filter(quarter => this.validateQuarter(quarter));
  }

  private validateQuarter(quarter: Quarter | null): Quarter | null {
    if (!quarter || !this.isValidMMYY(quarter.id)) {
      console.warn('Invalid quarter:', quarter);
      return null;
    }
    return quarter;
  }

  private isValidMMYY(mmyy: string): boolean {
    if (!mmyy || mmyy.length !== 4) return false;
    const month = parseInt(mmyy.substring(0, 2));
    const year = parseInt(mmyy.substring(2, 4));
    return month >= 1 && month <= 12 && year >= 20 && year <= 99;
  }

  private calculateQuarterStats(quarters: Quarter[]): QuarterStats[] {
    return quarters.map(quarter => ({
      quarterId: quarter.id,
      totalPlayers: 0, // You would calculate this from actual data
      averageScore: 0, // You would calculate this from actual data
      topScore: 0 // You would calculate this from actual data
    }));
  }

  private calculatePlayerStats(scores: PlayerScore[]): PlayerStats[] {
    const playerMap = new Map<string, PlayerStats>();
    
    scores.forEach(score => {
      const stats = playerMap.get(score.playerId) || {
        playerId: score.playerId,
        totalGames: 0,
        averageScore: 0,
        topScore: 0
      };
      
      stats.totalGames++;
      stats.averageScore = ((stats.averageScore * (stats.totalGames - 1)) + score.score) / stats.totalGames;
      stats.topScore = Math.max(stats.topScore, score.score);
      
      playerMap.set(score.playerId, stats);
    });
    
    return Array.from(playerMap.values());
  }
}