// Define el resultado común que produce cualquier regla de validación.
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Declara el contrato que deben cumplir todas las reglas.
export abstract class ValidationRule<T> {
  // Cada clase hija decide cómo valida su tipo de dato.
  abstract validate(value: T): ValidationResult;
}

// Valida números incluidos entre un mínimo y un máximo.
export class RangeRule extends ValidationRule<number> {
  constructor(
    private readonly minimum: number,
    private readonly maximum: number,
    private readonly errorMessage: string,
  ) {
    super();
  }

  validate(value: number): ValidationResult {
    const isValid = value >= this.minimum && value <= this.maximum;
    return { isValid, message: isValid ? "" : this.errorMessage };
  }
}

// Rechaza un valor concreto, como una zona restringida.
export class ExcludedValueRule extends ValidationRule<string> {
  constructor(
    private readonly excludedValue: string,
    private readonly errorMessage: string,
  ) {
    super();
  }

  validate(value: string): ValidationResult {
    const isValid = value !== this.excludedValue;
    return { isValid, message: isValid ? "" : this.errorMessage };
  }
}

// Encapsula un campo, su regla, su mensaje y su indicador visual.
export class FieldController<T> {
  constructor(
    private readonly input: HTMLInputElement | HTMLSelectElement,
    private readonly errorElement: HTMLElement,
    private readonly checkElement: HTMLElement,
    private readonly rule: ValidationRule<T>,
    private readonly readValue: (input: HTMLInputElement | HTMLSelectElement) => T,
  ) {}

  // Valida el valor actual y actualiza solo la parte visual de este campo.
  validate(): ValidationResult {
    const result = this.rule.validate(this.readValue(this.input));
    this.input.setAttribute("aria-invalid", String(!result.isValid));
    this.errorElement.textContent = result.message;
    this.checkElement.classList.toggle("pass", result.isValid);
    this.checkElement.querySelector<HTMLElement>(".check-icon")!.textContent = result.isValid ? "✓" : "×";
    return result;
  }

  // Permite que la aplicación reaccione cuando cambia el dato.
  onChange(listener: () => void): void {
    this.input.addEventListener("input", listener);
  }

  // Asigna un valor desde el botón de demostración.
  setValue(value: string): void {
    this.input.value = value;
  }

  // Devuelve el foco al campo cuando sea necesario.
  focus(): void {
    this.input.focus();
  }
}

// Reúne los cambios visuales que dependen del estado completo de la misión.
export class MissionView {
  constructor(
    private readonly score: HTMLElement,
    private readonly submitButton: HTMLButtonElement,
    private readonly missionStatus: HTMLElement,
    private readonly result: HTMLElement,
    private readonly toast: HTMLElement,
  ) {}

  // Representa el número de reglas aprobadas y habilita la acción final.
  renderValidation(passed: number, total: number): void {
    const allValid = passed === total;
    this.score.textContent = `${passed}/${total}`;
    this.score.classList.toggle("complete", allValid);
    this.submitButton.disabled = !allValid;
    this.missionStatus.textContent = allValid ? "Lista para despegar" : "Revisión pendiente";
    this.missionStatus.classList.toggle("ready", allValid);
    this.result.classList.toggle("success", allValid);
    this.result.innerHTML = allValid
      ? "<strong>Configuración segura.</strong><br>Ya puedes autorizar el despegue."
      : "<strong>Acción bloqueada.</strong><br>Corrige los campos señalados.";
  }

  // Muestra una confirmación temporal después del despegue.
  showAuthorization(): void {
    this.toast.classList.add("show");
    window.setTimeout(() => this.toast.classList.remove("show"), 3500);
  }
}

// Coordina los objetos del proyecto y actúa como punto de entrada.
export class MissionApplication {
  private readonly form: HTMLFormElement;
  private readonly fixButton: HTMLButtonElement;
  private readonly fields: FieldController<unknown>[];
  private readonly weightField: FieldController<number>;
  private readonly batteryField: FieldController<number>;
  private readonly zoneField: FieldController<string>;
  private readonly view: MissionView;

  constructor(private readonly root: Document) {
    // Construye cada campo con la regla que le corresponde.
    this.weightField = new FieldController(
      this.getElement<HTMLInputElement>("#weight"),
      this.getElement<HTMLElement>("#weightError"),
      this.getElement<HTMLElement>("#weightCheck"),
      new RangeRule(0.1, 5, "Usa un valor entre 0,1 y 5 kg."),
      (input) => Number(input.value),
    );

    this.batteryField = new FieldController(
      this.getElement<HTMLInputElement>("#battery"),
      this.getElement<HTMLElement>("#batteryError"),
      this.getElement<HTMLElement>("#batteryCheck"),
      new RangeRule(40, 100, "Usa un valor entre 40 % y 100 %."),
      (input) => Number(input.value),
    );

    this.zoneField = new FieldController(
      this.getElement<HTMLSelectElement>("#zone"),
      this.getElement<HTMLElement>("#zoneError"),
      this.getElement<HTMLElement>("#zoneCheck"),
      new ExcludedValueRule("restricted", "Selecciona una zona autorizada."),
      (input) => input.value,
    );

    // Guarda los campos bajo el mismo contrato para tratarlos de forma polimórfica.
    this.fields = [this.weightField, this.batteryField, this.zoneField];
    this.form = this.getElement<HTMLFormElement>("#missionForm");
    this.fixButton = this.getElement<HTMLButtonElement>("#fixButton");

    // Construye la vista con los elementos que representan el estado general.
    this.view = new MissionView(
      this.getElement<HTMLElement>("#score"),
      this.getElement<HTMLButtonElement>("#submitButton"),
      this.getElement<HTMLElement>("#missionStatus"),
      this.getElement<HTMLElement>("#result"),
      this.getElement<HTMLElement>("#toast"),
    );
  }

  // Conecta eventos y pinta el estado inicial.
  start(): void {
    this.fields.forEach((field) => field.onChange(() => this.validateMission()));
    this.fixButton.addEventListener("click", () => this.applySafeValues());
    this.form.addEventListener("submit", (event) => this.authorizeMission(event));
    this.validateMission();
  }

  // Ejecuta todos los objetos de validación y entrega el resultado a la vista.
  private validateMission(): boolean {
    const results = this.fields.map((field) => field.validate());
    const passed = results.filter((result) => result.isValid).length;
    this.view.renderValidation(passed, results.length);
    return passed === results.length;
  }

  // Configura un ejemplo seguro para demostrar el requisito.
  private applySafeValues(): void {
    this.weightField.setValue("3.5");
    this.batteryField.setValue("72");
    this.zoneField.setValue("north");
    this.validateMission();
    this.weightField.focus();
  }

  // Impide un envío inválido y confirma uno válido.
  private authorizeMission(event: SubmitEvent): void {
    event.preventDefault();
    if (this.validateMission()) this.view.showAuthorization();
  }

  // Busca un elemento y falla con un mensaje claro si falta en el HTML.
  private getElement<T extends Element>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) throw new Error(`No se encontró el elemento ${selector}`);
    return element;
  }
}
