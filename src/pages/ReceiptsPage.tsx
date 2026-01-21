import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Receipt,
  Upload,
  Camera,
  MoreVertical,
  Pencil,
  Trash2,
  Sparkles,
  Loader2,
  FileText,
  Image,
  Calendar,
  DollarSign,
  Building,
  Tag,
  FolderOpen,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Inbox
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Receipt as ReceiptType } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock OCR and AI analysis
const analyzeReceipt = async (): Promise<Partial<ReceiptType>> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const merchants = ['Office Depot', 'Staples', 'Amazon', 'Uber', 'Starbucks', 'Southwest Airlines', 'Marriott Hotels', 'Best Buy'];
  const categories = ['office', 'travel', 'meals', 'software', 'equipment', 'events'];
  
  const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomAmount = Math.floor(Math.random() * 500) + 10;
  const taxAmount = Math.round(randomAmount * 0.08 * 100) / 100;
  
  return {
    merchant: randomMerchant,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    totalAmount: randomAmount,
    taxAmount,
    currency: 'USD',
    invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
    suggestedCategory: randomCategory,
    tags: ['business', 'tax-deductible'],
    aiDescription: `Purchase from ${randomMerchant} - likely ${randomCategory} expense`,
    aiConfidence: Math.floor(Math.random() * 30) + 70
  };
};

export default function ReceiptsPage() {
  const { receipts, receiptCategories, addReceipt, updateReceipt, deleteReceipt, addCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Partial<ReceiptType> | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Partial<ReceiptType>>({});

  const filteredReceipts = receipts.filter(receipt => {
    if (selectedCategory !== 'all' && receipt.category !== selectedCategory) return false;
    if (searchQuery) {
      return (
        receipt.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  const inboxCount = receipts.filter(r => r.status === 'inbox').length;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setIsProcessing(true);
    
    try {
      const result = await analyzeReceipt();
      setAnalysisResult(result);
      setEditingReceipt({
        fileName: file.name,
        fileType: file.type.includes('pdf') ? 'pdf' : 'image',
        category: result.suggestedCategory || 'inbox',
        status: 'inbox',
        tags: result.tags || [],
        ...result
      });
    } catch {
      toast.error('Failed to analyze receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveReceipt = () => {
    if (!uploadedFile) return;
    
    addReceipt({
      fileName: uploadedFile.name,
      fileType: uploadedFile.type.includes('pdf') ? 'pdf' : 'image',
      merchant: editingReceipt.merchant,
      date: editingReceipt.date,
      totalAmount: editingReceipt.totalAmount,
      taxAmount: editingReceipt.taxAmount,
      currency: editingReceipt.currency || 'USD',
      invoiceNumber: editingReceipt.invoiceNumber,
      category: editingReceipt.category || 'inbox',
      suggestedCategory: analysisResult?.suggestedCategory,
      tags: editingReceipt.tags || [],
      aiDescription: analysisResult?.aiDescription,
      aiConfidence: analysisResult?.aiConfidence,
      status: editingReceipt.category === 'inbox' ? 'inbox' : 'categorized'
    });
    
    toast.success('Receipt added successfully');
    resetUploadState();
  };

  const resetUploadState = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setEditingReceipt({});
    setIsUploadDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteReceipt = (id: string) => {
    deleteReceipt(id);
    toast.success('Receipt deleted');
  };

  const handleBulkCategorize = (category: string) => {
    selectedReceipts.forEach(id => {
      updateReceipt(id, { category, status: 'categorized' });
    });
    setSelectedReceipts([]);
    toast.success(`${selectedReceipts.length} receipts categorized`);
  };

  const toggleSelectReceipt = (id: string) => {
    setSelectedReceipts(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = receiptCategories.find(c => c.id === categoryId);
    return cat?.color || '#6B7280';
  };

  const getCategoryName = (categoryId: string) => {
    const cat = receiptCategories.find(c => c.id === categoryId);
    return cat?.name || categoryId;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-7 h-7 text-receipt" />
            Receipts
          </h1>
          <p className="text-muted-foreground mt-1">
            Scan, organize, and share receipts with your accountant
          </p>
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Upload className="w-4 h-4" />
              Upload Receipt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-display">Upload Receipt</DialogTitle>
            </DialogHeader>
            
            {!uploadedFile ? (
              <div className="space-y-4 mt-4">
                <div 
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, or PDF up to 10MB</p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <div className="flex-1 border-t" />
                </div>
                
                <Button variant="outline" className="w-full gap-2">
                  <Camera className="w-4 h-4" />
                  Take Photo (Mobile)
                </Button>
              </div>
            ) : isProcessing ? (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="font-medium">Analyzing receipt...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Running OCR and AI classification
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {/* Analysis confidence */}
                {analysisResult?.aiConfidence && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      AI Confidence: <strong>{analysisResult.aiConfidence}%</strong>
                    </span>
                    {analysisResult.aiConfidence >= 80 ? (
                      <CheckCircle className="w-4 h-4 text-success ml-auto" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-warning ml-auto" />
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Merchant</Label>
                    <Input
                      value={editingReceipt.merchant || ''}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, merchant: e.target.value })}
                      placeholder="Store name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editingReceipt.date ? format(new Date(editingReceipt.date), 'yyyy-MM-dd') : ''}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, date: new Date(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingReceipt.totalAmount || ''}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, totalAmount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tax</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingReceipt.taxAmount || ''}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, taxAmount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={editingReceipt.currency || 'USD'}
                      onValueChange={(value) => setEditingReceipt({ ...editingReceipt, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editingReceipt.category || 'inbox'}
                    onValueChange={(value) => setEditingReceipt({ ...editingReceipt, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {receiptCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: cat.color }} 
                            />
                            {cat.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {analysisResult?.suggestedCategory && analysisResult.suggestedCategory !== editingReceipt.category && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI suggested: {getCategoryName(analysisResult.suggestedCategory)}
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-xs"
                        onClick={() => setEditingReceipt({ ...editingReceipt, category: analysisResult.suggestedCategory })}
                      >
                        Accept
                      </Button>
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={resetUploadState}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveReceipt}>
                    Save Receipt
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Bar */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Receipts</p>
                <p className="text-2xl font-bold">{receipts.length}</p>
              </div>
              <Receipt className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inbox</p>
                <p className="text-2xl font-bold">{inboxCount}</p>
              </div>
              <Inbox className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  ${receipts.reduce((sum, r) => sum + (r.totalAmount || 0), 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{receiptCategories.length}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search receipts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {receiptCategories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                <span className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }} 
                  />
                  {cat.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedReceipts.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Tag className="w-4 h-4" />
                Bulk Actions ({selectedReceipts.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {receiptCategories.filter(c => c.id !== 'inbox').map(cat => (
                <DropdownMenuItem key={cat.id} onClick={() => handleBulkCategorize(cat.id)}>
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: cat.color }} 
                  />
                  Move to {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Receipts Grid */}
      {filteredReceipts.length === 0 ? (
        <Card className="card-elevated">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No receipts match your filters' 
                : 'No receipts yet. Upload your first receipt!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReceipts.map((receipt) => (
            <Card 
              key={receipt.id} 
              className={cn(
                "card-elevated card-hover group",
                selectedReceipts.includes(receipt.id) && "ring-2 ring-primary"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedReceipts.includes(receipt.id)}
                    onCheckedChange={() => toggleSelectReceipt(receipt.id)}
                  />
                  
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {receipt.fileType === 'pdf' ? (
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <Image className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium truncate">{receipt.merchant || receipt.fileName}</h3>
                        {receipt.date && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(receipt.date), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteReceipt(receipt.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {receipt.totalAmount && (
                      <p className="text-lg font-semibold mt-2">
                        ${receipt.totalAmount.toFixed(2)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {receipt.currency}
                        </span>
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: `${getCategoryColor(receipt.category)}15`,
                          borderColor: getCategoryColor(receipt.category),
                          color: getCategoryColor(receipt.category)
                        }}
                      >
                        {getCategoryName(receipt.category)}
                      </Badge>
                      
                      {receipt.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      
                      {receipt.aiConfidence && (
                        <span className="ai-indicator text-[10px]">
                          <Sparkles className="w-3 h-3" />
                          {receipt.aiConfidence}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Google Drive Integration Notice */}
      <Card className="card-elevated border-primary/20 bg-primary/[0.02]">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Google Drive Integration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connect Google Drive to automatically backup receipts and generate shared Google Docs for your accountant.
            </p>
            <Button variant="link" className="px-0 h-auto mt-2 text-primary">
              Connect Google Drive →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
