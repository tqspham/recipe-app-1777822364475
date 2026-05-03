"use client";

interface InstructionsSectionProps {
  instructions: string[];
  cookTime: number;
}

export default function InstructionsSection({
  instructions,
  cookTime,
}: InstructionsSectionProps) {
  return (
    <div className="rounded-[0.75rem] border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Instructions</h2>
      <ol className="space-y-4">
        {instructions.map((instruction, idx) => (
          <li key={idx} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-[0.5rem] bg-blue-100 text-sm font-semibold text-blue-600">
                {idx + 1}
              </div>
            </div>
            <div className="pt-1">
              <p className="text-gray-700 text-sm">{instruction}</p>
            </div>
          </li>
        ))}
      </ol>
      {cookTime && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">
            Total cooking time: <span className="font-semibold text-gray-900">{cookTime} minutes</span>
          </p>
        </div>
      )}
    </div>
  );
}
