import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Car,
  ChevronDown,
  BriefcaseBusiness,
  House,
  Layers,
  LucideAngularModule,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Shapes,
  ShoppingCart,
  Trash2,
  Utensils,
  WalletCards,
  ChevronRight,
  type LucideIconData,
} from 'lucide-angular';

import { Category } from '../../models/category.model';
import {
  Transaction,
  TransactionFrequency,
  TransactionType,
} from '../../models/transaction.model';
import { CategoriesService } from '../../services/categories.service';
import { TransactionsService } from '../../services/transactions.service';

interface TransactionSummary {
  label: string;
  value: string;
  hint: string;
  icon: LucideIconData;
  tone: 'success' | 'error' | 'info' | 'accent';
}

@Component({
  selector: 'app-finance-transactions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './transactions.html',
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private readonly transactionsService = inject(TransactionsService);
  private readonly categoriesService = inject(CategoriesService);

  protected readonly TransactionType = TransactionType;

  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);

  protected readonly searchTerm = signal('');
  protected readonly selectedType = signal<TransactionType | null>(null);
  protected readonly selectedCategoryId = signal<string | null>(null);

  protected readonly filteredTransactions = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const type = this.selectedType();
    const categoryId = this.selectedCategoryId();

    return this.transactions().filter((transaction) => {
      const matchesSearch =
        !search ||
        transaction.description.toLowerCase().includes(search) ||
        this.getCategoryName(transaction.categoryId).toLowerCase().includes(search);

      const matchesType = type === null || transaction.type === type;

      const matchesCategory =
        categoryId === null || transaction.categoryId === categoryId;

      return matchesSearch && matchesType && matchesCategory;
    });
  });

  protected readonly summaries = computed<TransactionSummary[]>(() => {
    const transactions = this.transactions();

    const income = transactions
      .filter((transaction) => transaction.type === TransactionType.Income)
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
      .filter((transaction) => transaction.type === TransactionType.Expense)
      .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expense;

    return [
      {
        label: 'Receitas',
        value: this.formatCurrency(income),
        hint: 'Total registrado',
        icon: ArrowUp,
        tone: 'success',
      },
      {
        label: 'Despesas',
        value: this.formatCurrency(expense),
        hint: 'Total registrado',
        icon: ArrowDown,
        tone: 'error',
      },
      {
        label: 'Saldo',
        value: this.formatCurrency(balance),
        hint: 'Receitas - despesas',
        icon: WalletCards,
        tone: 'info',
      },
      {
        label: 'Total de transações',
        value: transactions.length.toString(),
        hint: 'Total registrado',
        icon: ReceiptText,
        tone: 'accent',
      },
    ];
  });

  protected readonly icons = {
    calendar: Calendar,
    chevronDown: ChevronDown,
    pencil: Pencil,
    plus: Plus,
    search: Search,
    trash: Trash2,
    chevronRight: ChevronRight,
  };

  private readonly iconMap: Record<string, LucideIconData> = {
    utensils: Utensils,
    car: Car,
    house: House,
    'shopping-cart': ShoppingCart,
    briefcase: BriefcaseBusiness,
    shapes: Shapes,
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
  }

  ngOnDestroy(): void {}

  protected updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  protected selectType(type: TransactionType | null): void {
    this.selectedType.set(type);
  }

  protected selectCategory(categoryId: string | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.selectedType.set(null);
    this.selectedCategoryId.set(null);
  }

  protected getCategoryName(categoryId: string): string {
    return (
      this.categories().find((category) => category.id === categoryId)?.name ??
      'Sem categoria'
    );
  }

  protected getCategoryColor(categoryId: string): string {
    return (
      this.categories().find((category) => category.id === categoryId)?.color ??
      '#64748B'
    );
  }

  protected getCategoryIcon(categoryId: string): LucideIconData {
    const iconName = this.categories().find(
      (category) => category.id === categoryId,
    )?.icon;

    return this.iconMap[iconName ?? ''] ?? Shapes;
  }

  protected getTypeLabel(type: TransactionType): string {
    return type === TransactionType.Income ? 'Receita' : 'Despesa';
  }

  protected getFrequencyLabel(frequency: TransactionFrequency): string {
    return frequency === TransactionFrequency.OneTime
      ? 'Única'
      : 'Recorrente';
  }

  protected typeIcon(type: TransactionType): LucideIconData {
    return type === TransactionType.Income ? ArrowUp : ArrowDown;
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  protected formatDate(date: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  }

  protected summaryToneClasses(
    tone: TransactionSummary['tone'],
  ): string {
    const classes = {
      success: 'bg-success/15 text-success border-success/20',
      error: 'bg-error/15 text-error border-error/20',
      info: 'bg-info/15 text-info border-info/20',
      accent: 'bg-primary/15 text-accent border-primary/20',
    };

    return classes[tone];
  }

  private loadTransactions(): void {
    this.loading.set(true);

    this.transactionsService.getAll().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading.set(false);
      },
    });
  }

  private loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }
}