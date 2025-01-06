import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game.component';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { OfflineQueueService } from '../../services/offline-queue.service';
import { ValidationService } from '../../services/validation.service';

@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [GameComponent],
  providers: [
    AuthService,
    GameService,
    OfflineQueueService,
    ValidationService
  ]
})
export class GameModule { }

// FOR_CLAUDE: Added new services to module providers