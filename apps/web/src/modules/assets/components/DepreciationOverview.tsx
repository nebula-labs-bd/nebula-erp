import { calculateAssetDepreciation } from "../services/depreciation.service";

import type { Asset } from "../types/asset.types";

type DepreciationOverviewProps = {
  assets: Asset[];
};

export default function DepreciationOverview({
  assets,
}: DepreciationOverviewProps) {
  const activeAssets = assets.filter(
    (asset) => asset.status === "active",
  );

  const totalAnnual = activeAssets.reduce(
    (sum, asset) => sum + calculateAssetDepreciation(asset).annual,
    0,
  );

  const totalCarrying = activeAssets.reduce(
    (sum, asset) => sum + asset.currentValue,
    0,
  );

  return (
    <div className="surface overflow-hidden">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-[var(--nebula-text-secondary)]">
            Active Assets
          </p>
          <p className="text-2xl font-bold">{activeAssets.length}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--nebula-text-secondary)]">
            Total Annual Depreciation
          </p>
          <p className="text-2xl font-bold">
            ${totalAnnual.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--nebula-text-secondary)]">
            Total Carrying Value
          </p>
          <p className="text-2xl font-bold">
            ${totalCarrying.toFixed(2)}
          </p>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Asset</th>
            <th className="p-3 text-right">Purchase Value</th>
            <th className="p-3 text-right">Carrying Value</th>
            <th className="p-3 text-right">Annual Depreciation</th>
          </tr>
        </thead>

        <tbody>
          {activeAssets.map((asset) => {
            const depreciation = calculateAssetDepreciation(asset);

            return (
              <tr key={asset.id} className="border-b">
                <td className="p-3 font-medium">{asset.name}</td>
                <td className="p-3 text-right">
                  ${asset.purchaseValue.toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ${asset.currentValue.toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ${depreciation.annual.toFixed(2)}
                </td>
              </tr>
            );
          })}

          {activeAssets.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-[var(--nebula-text-secondary)]"
              >
                No active assets to depreciate.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
