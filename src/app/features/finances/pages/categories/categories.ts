import { CommonModule } from '@angular/common';

import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  BarChart3,
  BriefcaseBusiness,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  House,
  Info,
  Layers,
  Lightbulb,
  LucideAngularModule,
  Pencil,
  Plus,
  Shapes,
  ShoppingBasket,
  Trash2,
  Utensils,
  type LucideIconData,
} from 'lucide-angular';

import {
  CategoryFormComponent,
  CategoryFormData,
} from '../../components/category-form/category-form';

import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

interface CategoryTip {
  title: string;
  description: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-finance-categories',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    CategoryFormComponent,
  ],
  templateUrl: './categories.html',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private readonly categoriesService = inject(CategoriesService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);

  protected readonly showForm = signal(false);
  protected readonly editingCategory = signal<CategoryFormData | null>(null);
  protected readonly saving = signal(false);

  private tipIntervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly icons = {
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    lightbulb: Lightbulb,
    info: Info,
    pencil: Pencil,
    plus: Plus,
    trash: Trash2,
  };

  protected readonly currentTipIndex = signal(0);

  protected readonly tips: CategoryTip[] = [
    {
      title: 'Agrupe com clareza',
      description:
        'Use nomes simples para enxergar rapidamente para onde cada transação deve ir.',
      icon: Shapes,
    },
    {
      title: 'Revise recorrentes',
      description:
        'Assinaturas e contas fixas ficam mais fáceis de acompanhar quando usam sempre a mesma categoria.',
      icon: Calendar,
    },
    {
      title: 'Compare tendências',
      description:
        'Olhe suas categorias ao longo do mês para perceber excessos antes do fechamento.',
      icon: BarChart3,
    },
    {
      title: 'Mantenha enxuto',
      description:
        'Categorias demais dificultam a leitura. Una itens parecidos quando fizer sentido.',
      icon: Layers,
    },
  ];

  protected readonly currentTip = computed(
    () => this.tips[this.currentTipIndex()]
  );

  private readonly iconMap: Record<string, LucideIconData> = {
    utensils: Utensils,
    car: Car,
    house: House,
    'shopping-cart': ShoppingBasket,
    briefcase: BriefcaseBusiness,
    shapes: Shapes,
  };

  ngOnInit(): void {
    this.loadCategories();
    this.startTipRotation();
  }

  ngOnDestroy(): void {
    if (this.tipIntervalId) {
      clearInterval(this.tipIntervalId);
    }
  }

  /**
   * Abre o formulário para criação de uma nova categoria.
   */
  protected openCreateForm(): void {
    this.editingCategory.set(null);
    this.showForm.set(true);
  }

  /**
   * Abre o formulário para edição da categoria selecionada.
   */
  protected openEditForm(category: Category): void {
    this.editingCategory.set({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
    });

    this.showForm.set(true);
  }

  /**
   * Fecha o formulário sem salvar alterações.
   */
  protected closeForm(): void {
    this.showForm.set(false);
    this.editingCategory.set(null);
  }

  /**
   * Recebe os dados enviados pelo CategoryFormComponent
   * e decide entre criação e atualização.
   */
  protected saveCategory(data: CategoryFormData): void {
    this.saving.set(true);

    if (data.id) {
      this.updateCategory(data);
      return;
    }

    this.createCategory(data);
  }

  private createCategory(data: CategoryFormData): void {
    this.categoriesService
      .create({
        name: data.name,
        color: data.color,
        icon: data.icon,
      })
      .subscribe({
        next: (category) => {
          this.categories.update((categories) => [
            ...categories,
            category,
          ]);

          this.saving.set(false);
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.saving.set(false);
        },
      });
  }

  private updateCategory(data: CategoryFormData): void {
    if (!data.id) {
      return;
    }

    this.categoriesService
      .update(data.id, {
        name: data.name,
        color: data.color,
        icon: data.icon,
      })
      .subscribe({
        next: (updatedCategory) => {
          this.categories.update((categories) =>
            categories.map((category) =>
              category.id === updatedCategory.id
                ? updatedCategory
                : category
            )
          );

          this.saving.set(false);
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.saving.set(false);
        },
      });
  }

  protected deleteCategory(category: Category): void {
    const confirmed = window.confirm(
      `Deseja realmente excluir a categoria "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.categoriesService.delete(category.id).subscribe({
      next: () => {
        this.categories.update((categories) =>
          categories.filter(
            (currentCategory) => currentCategory.id !== category.id
          )
        );
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      },
    });
  }

  private loadCategories(): void {
    this.loading.set(true);

    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      },
    });
  }

  private getIcon(iconName: string): LucideIconData {
    return this.iconMap[iconName] ?? Shapes;
  }

  protected getCategoryIcon(category: Category): LucideIconData {
    return this.getIcon(category.icon);
  }

  protected getColorName(color: string): string {
    const colors: Record<string, string> = {
      '#22C55E': 'Verde',
      '#3B82F6': 'Azul',
      '#F59E0B': 'Amarelo',
      '#A855F7': 'Roxo',
      '#EC4899': 'Rosa',
      '#14B8A6': 'Ciano',
      '#F97316': 'Laranja',
      '#84CC16': 'Lima',
      '#64748B': 'Cinza',
    };

    return colors[color.toUpperCase()] ?? 'Personalizado';
  }

  protected previousTip(): void {
    this.currentTipIndex.update((index) =>
      index === 0 ? this.tips.length - 1 : index - 1
    );

    this.restartTipRotation();
  }

  protected nextTip(): void {
    this.currentTipIndex.update(
      (index) => (index + 1) % this.tips.length
    );

    this.restartTipRotation();
  }

  private startTipRotation(): void {
    this.tipIntervalId = setInterval(() => {
      this.currentTipIndex.update(
        (index) => (index + 1) % this.tips.length
      );
    }, 10000);
  }

  private restartTipRotation(): void {
    if (this.tipIntervalId) {
      clearInterval(this.tipIntervalId);
    }

    this.startTipRotation();
  }
}