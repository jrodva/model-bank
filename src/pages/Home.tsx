import { SafeAreaView, Text, View } from 'react-native'
import { ItemsList } from '@vacacode/ui'
import { useTransactions } from '../hooks/useTransactions'
import { homeStyles } from './Home.styles'

const LOGO_TEXT = 'MB'
const TITLE = 'Model Bank Transactions'
const ESTIMATED_ITEM_SIZE = 72
const ACCESSIBILITY_LEVEL = 'Transactions list'

export const Home = () => {
  const { items, isLoading, isLoadingMore, hasNextPage, error, fetchNextPage } = useTransactions()

  return (
    <SafeAreaView style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View style={homeStyles.logo}>
          <Text style={homeStyles.logoText}>{LOGO_TEXT}</Text>
        </View>
        <Text style={homeStyles.bankName}>{TITLE}</Text>
      </View>
      <ItemsList
        items={items}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasNextPage={hasNextPage}
        error={error}
        onEndReached={fetchNextPage}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        accessibilityLabel={ACCESSIBILITY_LEVEL}
      />
    </SafeAreaView>
  )
}
