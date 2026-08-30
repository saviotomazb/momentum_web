import { Component, effect, inject, input, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  ArrowLeft,
  BriefcaseBusiness,
  Car,
  Check,
  Dumbbell,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  House,
  Leaf,
  LucideAngularModule,
  Music,
  PawPrint,
  Pencil,
  Plus,
  Save,
  Shirt,
  ShoppingCart,
  Sparkles,
  Utensils,
  X,
  type LucideIconData,
} from 'lucide-angular';

export interface CategoryFormData {
  id?: string;
  name: string;
  color: string;
  icon: string;
}

interface CategoryColor {
  name: string;
  value: string;
}

interface CategoryIcon {
  name: string;
  value: LucideIconData;
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './category-form.html',
})
export class CategoryFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly category = input<CategoryFormData | null>(null);

  readonly save = output<CategoryFormData>();

  readonly cancel = output<void>();

  protected readonly icons = {
    arrowLeft: ArrowLeft,
    check: Check,
    chevronRight: ArrowLeft,
    close: X,
    pencil: Pencil,
    plus: Plus,
    save: Save,
  };

  protected readonly colors: CategoryColor[] = [
    {
      name: 'Verde',
      value: '#22C55E',
    },
    {
      name: 'Azul',
      value: '#3B82F6',
    },
    {
      name: 'Amarelo',
      value: '#F59E0B',
    },
    {
      name: 'Roxo',
      value: '#A855F7',
    },
    {
      name: 'Rosa',
      value: '#EC4899',
    },
    {
      name: 'Ciano',
      value: '#14B8A6',
    },
    {
      name: 'Laranja',
      value: '#F97316',
    },
    {
      name: 'Lima',
      value: '#84CC16',
    },
    {
      name: 'Cinza',
      value: '#64748B',
    },
  ];

  protected readonly availableIcons: CategoryIcon[] = [
    {
      name: 'utensils',
      value: Utensils,
    },
    {
      name: 'car',
      value: Car,
    },
    {
      name: 'house',
      value: House,
    },
    {
      name: 'shopping-cart',
      value: ShoppingCart,
    },
    {
      name: 'briefcase',
      value: BriefcaseBusiness,
    },
    {
      name: 'heart-pulse',
      value: HeartPulse,
    },
    {
      name: 'sparkles',
      value: Sparkles,
    },
    {
      name: 'graduation-cap',
      value: GraduationCap,
    },
    {
      name: 'gamepad',
      value: Gamepad2,
    },
    {
      name: 'music',
      value: Music,
    },
    {
      name: 'shirt',
      value: Shirt,
    },
    {
      name: 'dumbbell',
      value: Dumbbell,
    },
    {
      name: 'paw',
      value: PawPrint,
    },
    {
      name: 'leaf',
      value: Leaf,
    },
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
      ],
    ],
    color: [
      this.colors[0].value,
      Validators.required,
    ],
    icon: [
      this.availableIcons[0].name,
      Validators.required,
    ],
  });

  constructor() {
    effect(() => {
      const category = this.category();

      if (category) {
        this.form.patchValue({
          name: category.name,
          color: category.color,
          icon: category.icon,
        });

        return;
      }

      this.form.reset({
        name: '',
        color: this.colors[0].value,
        icon: this.availableIcons[0].name,
      });
    });
  }

  protected isEditMode(): boolean {
    return !!this.category()?.id;
  }

  protected selectedIcon(): LucideIconData {
    const iconName = this.form.controls.icon.value;

    return (
      this.availableIcons.find(
        icon => icon.name === iconName,
      )?.value ?? this.availableIcons[0].value
    );
  }

  protected selectedColorName(): string {
    const colorValue = this.form.controls.color.value;

    return (
      this.colors.find(
        color => color.value === colorValue,
      )?.name ?? this.colors[0].name
    );
  }

  protected selectColor(color: string): void {
    this.form.controls.color.setValue(color);
  }

  protected selectIcon(icon: string): void {
    this.form.controls.icon.setValue(icon);
  }

  protected saveCategory(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      id: this.category()?.id,
      name: value.name.trim(),
      color: value.color,
      icon: value.icon,
    });
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected get nameInvalid(): boolean {
    const control = this.form.controls.name;

    return control.invalid && control.touched;
  }
}