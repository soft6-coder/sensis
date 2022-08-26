package marketplace.sensis.app.collection;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CollectionService {
	@Autowired
	private CollectionRepository collectionRepository;

	public Collection addCollection(Collection collection) {
		return collectionRepository.save(collection);
	}

	public List<Collection> addCollections(List<Collection> collections) {
		return (List<Collection>) collectionRepository.saveAll(collections);
	}
	
	public Collection getCollectionByAddress(String address) {
		return collectionRepository.findByAddress(address);
	}
	
	public List<Collection> getCollections() {
		return (List<Collection>) collectionRepository.findAll();
	}
	
	public void deleteCollectionByAddress(String address) {
		collectionRepository.deleteByAddress(address);
	}

}
