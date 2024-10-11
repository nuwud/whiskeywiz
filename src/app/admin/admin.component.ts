import { FirebaseService } from "../services/firebase.service";
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent {
  // Component logic here
  constructor(private firebaseService: FirebaseService) {}
}

function Component(arg0: { selector: string; templateUrl: string; styleUrls: string[]; }): (target: typeof AdminComponent, context: ClassDecoratorContext<typeof AdminComponent>) => void | typeof AdminComponent {
    
    throw new Error("Function not implemented.");
}
