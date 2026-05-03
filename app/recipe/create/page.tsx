import ProtectedRoute from '@/components/ProtectedRoute';
import CreateRecipeContent from '@/components/CreateRecipeContent';

export default function CreateRecipePage() {
  return (
    <ProtectedRoute>
      <CreateRecipeContent />
    </ProtectedRoute>
  );
}
