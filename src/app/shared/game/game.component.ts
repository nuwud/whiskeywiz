export type SampleLetter = 'A' | 'B' | 'C' | 'D';
// Component implementation
@Component({
  readonly sampleLetters: SampleLetter[] = ['A', 'B', 'C', 'D'];
  currentSample: SampleLetter = 'A';
  // Rest of implementation
})