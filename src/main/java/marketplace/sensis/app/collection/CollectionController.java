package marketplace.sensis.app.collection;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CollectionController {

	@Autowired
	private CollectionService collectionService;
	
	@RequestMapping(method = RequestMethod.POST, value = "/collection")
	public Collection addCollection(@RequestBody Collection collection) {
		return collectionService.addCollection(collection);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/collections")
	public List<Collection> addCollections(@RequestBody List<Collection> collections) {
		return collectionService.addCollections(collections);
	}
	
	@RequestMapping("/collection/{address}")
	public Collection getCollectionByAddress(@PathVariable String address) {
		return collectionService.getCollectionByAddress(address);
	}
	
	@RequestMapping("/collections")
	public List<Collection> getCollections() {
		return collectionService.getCollections();
	}
	
	@RequestMapping("/collection/{address}/delete")
	public void deleteCollectionByAddress(@PathVariable String address) {
		collectionService.deleteCollectionByAddress(address);
	}
}
