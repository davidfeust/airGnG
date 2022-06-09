import React, { useRef } from 'react';
import {
    FlatList, Platform, TouchableWithoutFeedback,
    View
} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Station } from '../App.d';
import MiniCard from './MiniCard';

export default function SlidingStations({
    flatList,
    publishedStations,
    onSelectingCard,
    ownerDetails,
    cardWidth,
    cardMarginHorizontal,
    viewConfig,
    onViewChanged,
    animateToMarker,
    down,
}: {
    flatList: React.MutableRefObject<FlatList<Station>>;
    publishedStations: Station[];
    onSelectingCard: (station: Station) => void;
    ownerDetails: any[];
    cardWidth: number;
    cardMarginHorizontal: number;
    down:boolean;
    viewConfig: React.MutableRefObject<{
        itemVisiblePercentThreshold: number;
        waitForInteraction: boolean;
        minimumViewTime: number;
    }>;
    onViewChanged: React.MutableRefObject<
        ({ viewableItems }: { viewableItems: any }) => void
    >;
    animateToMarker: () => void;
}) {
    const slideUpPanel = useRef<SlidingUpPanel>();
    slideUpPanel.current?.show();
    
    
    return <SlidingUpPanel
    draggableRange={{ top: 230, bottom: 130 }}
    ref={(c) => (slideUpPanel.current = c)}
    backdropOpacity={0.3}
    snappingPoints={[130, 230]}
    
>
    <FlatList
        style={{ position: 'absolute' }}
        keyExtractor={(item) => item.id}
        ref={flatList}
        data={publishedStations}
        renderItem={({ item, index }) => (
            <TouchableWithoutFeedback
                onPress={() => onSelectingCard(item)}
            >
                <View>
                    <MiniCard
                        image={item.image}
                        ownerDetails={ownerDetails[index]}
                        address={item.address}
                        price={item.price}
                        plugType={item.plug_type}
                        style={{
                            width: cardWidth,
                            overflow: 'hidden',
                            marginHorizontal: cardMarginHorizontal,
                        }} />
                </View>
            </TouchableWithoutFeedback>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 2 * cardMarginHorizontal}
        contentContainerStyle={{
            paddingHorizontal: Platform.OS === 'android'
                ? cardMarginHorizontal / 2
                : 0,
        }}
        decelerationRate={'fast'}
        viewabilityConfig={viewConfig.current}
        onViewableItemsChanged={onViewChanged.current}
        onMomentumScrollEnd={animateToMarker}
        getItemLayout={(data, index) => ({
            length: cardWidth + cardMarginHorizontal * 2,
            offset: (cardWidth + cardMarginHorizontal * 2) * index,
            index,
        })} />
</SlidingUpPanel>;

}
