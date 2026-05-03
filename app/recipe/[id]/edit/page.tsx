import ProtectedRoute from '@/components/ProtectedRoute';
import EditRecipeContent from '@/components/EditRecipeContent';

export default function EditRecipePage() {
  return (
    <ProtectedRoute>
      <EditRecipeContent />
    </ProtectedRoute>
  );
}
