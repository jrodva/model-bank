import { SafeAreaView, Text, View } from 'react-native'
import { ItemsList } from '@vacacode/ui'
import { useTransactions } from '../hooks/useTransactions'
import { homeStyles } from './Home.styles'

const ESTIMATED_ITEM_SIZE = 72;

export const Home = () => {
  const { items, isLoading, isLoadingMore, hasNextPage, error, fetchNextPage } = useTransactions()

  return (
    <SafeAreaView style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View style={homeStyles.logo}>
          <Text style={homeStyles.logoText}>MB</Text>
        </View>
        <Text style={homeStyles.bankName}>Model Bank Transactions</Text>
      </View>
      <ItemsList
        items={items}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasNextPage={hasNextPage}
        error={error}
        onEndReached={fetchNextPage}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        accessibilityLabel="Transactions list"
      />
    </SafeAreaView>
  )
}
