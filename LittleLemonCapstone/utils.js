import {useRef, useEffect} from 'react';

export function getSectionListData(menuItems) {
  // Group items by category
  const groupedItems = menuItems.reduce((groups, item) => {
      const group = groups[item.category] || [];
      group.push(item);
      groups[item.category] = group;
      return groups;
  }, {});

  // Convert to section list data
  const sectionListData = Object.entries(groupedItems).map(([category, data]) => ({
      category,
      data,
  }));

  return sectionListData;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}