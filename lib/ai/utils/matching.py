from __future__ import annotations

from typing import Tuple

import numpy as np


def linear_sum_assignment(cost_matrix: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Lightweight greedy matcher used as a drop-in for scipy.optimize.linear_sum_assignment.

    This is not a full Hungarian implementation but is sufficient for associating the
    modest-sized cost matrices produced by the sperm tracker (number of tracks vs detections).
    """
    cost = np.asarray(cost_matrix, dtype=np.float64)
    if cost.ndim != 2:
        raise ValueError("cost_matrix must be 2-dimensional")

    rows, cols = cost.shape
    if rows == 0 or cols == 0:
        return np.empty(0, dtype=np.int64), np.empty(0, dtype=np.int64)

    remaining_rows = set(range(rows))
    remaining_cols = set(range(cols))
    row_ind: list[int] = []
    col_ind: list[int] = []

    while remaining_rows and remaining_cols:
        best_pair = None
        best_cost = np.inf
        for r in remaining_rows:
            row = cost[r]
            for c in remaining_cols:
                value = row[c]
                if np.isnan(value):
                    continue
                if value < best_cost:
                    best_cost = value
                    best_pair = (r, c)
        if best_pair is None or not np.isfinite(best_cost):
            break
        r, c = best_pair
        row_ind.append(r)
        col_ind.append(c)
        remaining_rows.remove(r)
        remaining_cols.remove(c)

    return np.array(row_ind, dtype=np.int64), np.array(col_ind, dtype=np.int64)

