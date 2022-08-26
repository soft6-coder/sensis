package marketplace.sensis.app.nft;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NftController {
	@Autowired
	private NftService nftService;
	
	@RequestMapping(method = RequestMethod.POST, value="/nft")
	public Nft addNft(@RequestBody Nft nft) {
		return nftService.addNft(nft);
	}
	
	@RequestMapping("/nft/{token}")
	public Nft getNft(@PathVariable String token) {
		return nftService.getNftByToken(token);
	}
	
	@RequestMapping("/nfts")
	public List<Nft> getNfts() {
		return nftService.getNfts();
	}
}
